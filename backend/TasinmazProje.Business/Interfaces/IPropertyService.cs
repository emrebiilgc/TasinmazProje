using System.Collections.Generic;
using System.Threading.Tasks;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Interfaces
{
    public interface IPropertyService
    {
        Task<List<Property>> GetAllAsync();
        Task<Property?> GetByIdAsync(int id);
        Task AddAsync(Property property);
        Task UpdateAsync(Property property);
        Task DeleteAsync(int id); 
        Task<List<Property>> FilterAsync(int? cityId, int? districtId, int? neighborhoodId);
    }
}