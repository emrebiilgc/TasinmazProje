using System.Collections.Generic;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.DataAccess.Repositories;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Services
{
    public class CityService : ICityService
    {
        private readonly ICityRepository _cityRepository;

        public CityService(ICityRepository cityRepository)
        {
            _cityRepository = cityRepository;
        }

        public List<City> GetAll() => _cityRepository.GetAll();
        public City? GetById(int id) => _cityRepository.GetById(id);
    }
}