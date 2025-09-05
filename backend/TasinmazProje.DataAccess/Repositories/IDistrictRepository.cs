using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public interface IDistrictRepository
    {
        List<District> GetAll();
        District? GetById(int id);
        void Add(District district);
        void Update(District district);
        void Delete(int id);
    }
}