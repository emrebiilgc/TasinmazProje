using System.Collections.Generic;
using System.Threading.Tasks;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);

        bool CheckPassword(string inputPassword, string storedHash);
        string HashPassword(string password);
        void SetPassword(User user, string plainPassword);
    }
}