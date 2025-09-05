using Microsoft.EntityFrameworkCore;
using TasinmazProje.DataAccess.Context;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public class EfPropertyRepository : IPropertyRepository
    {
        private readonly TasinmazDbContext _context;

        public EfPropertyRepository(TasinmazDbContext context)
        {
            _context = context;
        }

        public IQueryable<Property> GetAll() 
        {
            return _context.Properties
                .Include(p => p.City)
                .Include(p => p.District)
                .Include(p => p.Neighborhood);
        }

        public async Task<Property?> GetByIdAsync(int id)
        {
            return await _context.Properties
                .Include(p => p.City)
                .Include(p => p.District)
                .Include(p => p.Neighborhood)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddAsync(Property property)
        {
            await _context.Properties.AddAsync(property);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Property property)
        {
            _context.Properties.Update(property);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property != null)
            {
                _context.Properties.Remove(property);
                await _context.SaveChangesAsync();
            }
        }
    }
}
