using Microsoft.EntityFrameworkCore;
using TasinmazProje.DataAccess.Context;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public class EfNeighborhoodRepository : INeighborhoodRepository
    {
        private readonly TasinmazDbContext _context;

        public EfNeighborhoodRepository(TasinmazDbContext context)
        {
            _context = context;
        }

        public List<Neighborhood> GetAll() =>
            _context.Neighborhoods.Include(n => n.District).ThenInclude(d => d.City).ToList();

        public Neighborhood? GetById(int id) =>
            _context.Neighborhoods.Include(n => n.District).ThenInclude(d => d.City).FirstOrDefault(n => n.Id == id);

        public void Add(Neighborhood neighborhood)
        {
            _context.Neighborhoods.Add(neighborhood);
            _context.SaveChanges();
        }

        public void Update(Neighborhood neighborhood)
        {
            _context.Neighborhoods.Update(neighborhood);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var neighborhood = _context.Neighborhoods.Find(id);
            if (neighborhood != null)
            {
                _context.Neighborhoods.Remove(neighborhood);
                _context.SaveChanges();
            }
        }
    }
}