using System.Collections.Generic;

namespace TasinmazProje.Business.Interfaces
{
    public interface IDistrictService
    {
        List<TasinmazProje.Entities.District> GetAll();
        TasinmazProje.Entities.District? GetById(int id);
    }
}