using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Entities;
using TasinmazProje.Presentation.Dtos;
using TasinmazProje.Presentation.Utilities;

namespace TasinmazProje.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public AuthController(IUserService userService, IConfiguration config, ILogService logService)
        {
            _userService = userService;
            _config = config;
            _logService = logService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserCreateDto dto)
        {
            var existing = await _userService.GetByEmailAsync(dto.Email);
            if (existing != null)
            {
                await _logService.LogAsync(null, "Kayıt", $"Zaten kayıtlı e-posta ile kayıt denemesi: {dto.Email}", false);
                return BadRequest("Bu e-posta zaten kullanılıyor.");
            }

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Role = dto.Role,
                Address = dto.Address
            };

            _userService.SetPassword(user, dto.Password);
            await _userService.AddAsync(user);
            await _logService.LogAsync(user.Id, "Kayıt", $"Yeni kullanıcı oluşturuldu: {user.Email}");

            return Ok("Kullanıcı başarıyla oluşturuldu.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null || !_userService.CheckPassword(dto.Password, user.PasswordHash))
            {
                await _logService.LogAsync(null, "Giriş", $"Başarısız giriş denemesi: {dto.Email}", false);
                return Unauthorized("E-posta veya parola hatalı.");
            }

            var token = JwtTokenGenerator.GenerateToken(user, _config);
            await _logService.LogAsync(user.Id, "Giriş", $"Kullanıcı giriş yaptı: {user.Email}");

            return Ok(new { token });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim != null)
                {
                    int userId = int.Parse(userIdClaim.Value);
                    var user = await _userService.GetByIdAsync(userId);
                    await _logService.LogAsync(userId, "Çıkış", $"Kullanıcı çıkış yaptı: {user?.Email ?? "Bilinmiyor"}");
                }
                else
                {
                    await _logService.LogAsync(null, "Çıkış", "Çıkış yapılmaya çalışıldı ama UserId bulunamadı", false);
                }
            }
            catch (Exception ex)
            {
                await _logService.LogAsync(null, "Çıkış", $"Çıkış sırasında hata oluştu: {ex.Message}", false);
            }

            return Ok(new { message = "Çıkış yapıldı." });
        }
    }
}
