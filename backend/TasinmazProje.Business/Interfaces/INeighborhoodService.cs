using System.Collections.Generic;

namespace TasinmazProje.Business.Interfaces
{
    public interface INeighborhoodService
    {
        List<TasinmazProje.Entities.Neighborhood> GetAll();
        TasinmazProje.Entities.Neighborhood? GetById(int id);
    }
}