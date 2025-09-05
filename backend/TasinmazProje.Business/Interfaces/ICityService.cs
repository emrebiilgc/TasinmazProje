using System.Collections.Generic;

namespace TasinmazProje.Business.Interfaces
{
    public interface ICityService
    {
        List<TasinmazProje.Entities.City> GetAll();
        TasinmazProje.Entities.City? GetById(int id);
    }
}