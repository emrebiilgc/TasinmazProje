using System.Security.Cryptography;
using System.Text;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.DataAccess.Repositories;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<User>> GetAllAsync() => await _userRepository.GetAllAsync();

        public async Task<User?> GetByIdAsync(int id) => await _userRepository.GetByIdAsync(id);

        public async Task<User?> GetByEmailAsync(string email) => await _userRepository.GetByEmailAsync(email);

        public async Task AddAsync(User user)
        {
            await _userRepository.AddAsync(user);
        }

        public async Task UpdateAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user != null)
            {
                await _userRepository.DeleteAsync(id);
            }
        }

        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        public bool CheckPassword(string inputPassword, string storedHash)
        {
            var inputHash = HashPassword(inputPassword);
            return inputHash == storedHash;
        }

        public void SetPassword(User user, string plainPassword)
        {
            user.PasswordHash = HashPassword(plainPassword);
        }
    }
}