using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Entities;
using TasinmazProje.Presentation.Dtos;

namespace TasinmazProje.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogService _logService;
        private readonly IConfiguration _config;

        public UserController(IUserService userService, ILogService logService, IConfiguration config)
        {
            _userService = userService;
            _logService = logService;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null || !_userService.CheckPassword(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "E-posta veya şifre hatalı." });

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);

            await _logService.LogAsync(user.Id, "Login", $"Giriş yaptı: {user.Email}");

            return Ok(new { token = tokenStr });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            var dtoList = users.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role,
                Address = u.Address
            }).ToList();

            return Ok(dtoList);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            await _userService.DeleteAsync(id);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _logService.LogAsync(currentUserId, "User Delete", $"Kullanıcı silindi: {user.Email}");

            return Ok(new { message = "Kullanıcı başarıyla silindi." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(UserCreateDto dto)
        {
            var newUser = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Role = dto.Role,
                Address = dto.Address
            };

            _userService.SetPassword(newUser, dto.Password);
            await _userService.AddAsync(newUser);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _logService.LogAsync(currentUserId, "User Create", $"Yeni kullanıcı eklendi: {newUser.Email}");

            return Ok(new { message = "Kullanıcı başarıyla eklendi." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Update(UserUpdateDto dto)
        {
            var user = await _userService.GetByIdAsync(dto.Id);
            if (user == null)
                return NotFound();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.Role = dto.Role;
            user.Address = dto.Address;

            await _userService.UpdateAsync(user);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _logService.LogAsync(currentUserId, "User Update", $"Kullanıcı güncellendi: {user.Email}");

            return Ok(new { message = "Kullanıcı başarıyla güncellendi." });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            var dto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Address = user.Address
            };

            return Ok(dto);
        }
    }
}
