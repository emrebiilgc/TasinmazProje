using System.Collections.Generic;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.DataAccess.Repositories;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Services
{
    public class NeighborhoodService : INeighborhoodService
    {
        private readonly INeighborhoodRepository _neighborhoodRepository;

        public NeighborhoodService(INeighborhoodRepository neighborhoodRepository)
        {
            _neighborhoodRepository = neighborhoodRepository;
        }

        public List<Neighborhood> GetAll() => _neighborhoodRepository.GetAll();
        public Neighborhood? GetById(int id) => _neighborhoodRepository.GetById(id);
    }
}