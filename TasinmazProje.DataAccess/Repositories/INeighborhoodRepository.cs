using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public interface INeighborhoodRepository
    {
        List<Neighborhood> GetAll();
        Neighborhood? GetById(int id);
        void Add(Neighborhood neighborhood);
        void Update(Neighborhood neighborhood);
        void Delete(int id);
    }
}