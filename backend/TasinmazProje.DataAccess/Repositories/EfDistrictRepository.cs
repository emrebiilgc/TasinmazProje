using Microsoft.EntityFrameworkCore;
using TasinmazProje.DataAccess.Context;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public class EfDistrictRepository : IDistrictRepository
    {
        private readonly TasinmazDbContext _context;

        public EfDistrictRepository(TasinmazDbContext context)
        {
            _context = context;
        }

        public List<District> GetAll() => _context.Districts.Include(d => d.City).ToList();

        public District? GetById(int id) => _context.Districts.Include(d => d.City).FirstOrDefault(d => d.Id == id);

        public void Add(District district)
        {
            _context.Districts.Add(district);
            _context.SaveChanges();
        }

        public void Update(District district)
        {
            _context.Districts.Update(district);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var district = _context.Districts.Find(id);
            if (district != null)
            {
                _context.Districts.Remove(district);
                _context.SaveChanges();
            }
        }
    }
}