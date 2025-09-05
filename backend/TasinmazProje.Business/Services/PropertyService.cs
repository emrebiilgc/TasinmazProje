using Microsoft.EntityFrameworkCore;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.DataAccess.Repositories;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;

        public PropertyService(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public async Task<List<Property>> GetAllAsync()
        {
            return await _propertyRepository.GetAll()
                .Include(p => p.City)
                .Include(p => p.District)
                .Include(p => p.Neighborhood)
                .ToListAsync();
        }

        public async Task<Property?> GetByIdAsync(int id)
        {
            return await _propertyRepository.GetAll()
                .Include(p => p.City)
                .Include(p => p.District)
                .Include(p => p.Neighborhood)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddAsync(Property property)
        {
            await _propertyRepository.AddAsync(property);
        }

        public async Task UpdateAsync(Property property)
        {
            await _propertyRepository.UpdateAsync(property);
        }

        public async Task DeleteAsync(int id)
        {
            await _propertyRepository.DeleteAsync(id);
        }

        public async Task<List<Property>> FilterAsync(int? cityId, int? districtId, int? neighborhoodId)
        {
            var query = _propertyRepository.GetAll()
                .Include(p => p.City)
                .Include(p => p.District)
                .Include(p => p.Neighborhood)
                .AsQueryable();

            if (cityId.HasValue)
                query = query.Where(p => p.CityId == cityId.Value);

            if (districtId.HasValue)
                query = query.Where(p => p.DistrictId == districtId.Value);

            if (neighborhoodId.HasValue)
                query = query.Where(p => p.NeighborhoodId == neighborhoodId.Value);

            return await query.ToListAsync();
        }
    }
}
