using System.Linq;
using System.Threading.Tasks;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public interface IPropertyRepository
    {
        IQueryable<Property> GetAll();
        Task<Property?> GetByIdAsync(int id);
        Task AddAsync(Property property);
        Task UpdateAsync(Property property);
        Task DeleteAsync(int id);
    }
}