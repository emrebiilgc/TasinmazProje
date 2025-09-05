using Microsoft.EntityFrameworkCore;
using TasinmazProje.DataAccess.Context;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public class EfCityRepository : ICityRepository
    {
        private readonly TasinmazDbContext _context;

        public EfCityRepository(TasinmazDbContext context)
        {
            _context = context;
        }

        public List<City> GetAll()
        {
            return _context.Cities
                .Include(c => c.Districts)
                .ThenInclude(d => d.Neighborhoods)
                .ToList();
        }

        public City? GetById(int id)
        {
            return _context.Cities
                .Include(c => c.Districts)
                .ThenInclude(d => d.Neighborhoods)
                .FirstOrDefault(c => c.Id == id);
        }

        public void Add(City city)
        {
            _context.Cities.Add(city);
            _context.SaveChanges();
        }

        public void Update(City city)
        {
            _context.Cities.Update(city);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var city = _context.Cities.Find(id);
            if (city != null)
            {
                _context.Cities.Remove(city);
                _context.SaveChanges();
            }
        }
    }
}