using System.Collections.Generic;
using System.Threading.Tasks;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id); 
    }
}