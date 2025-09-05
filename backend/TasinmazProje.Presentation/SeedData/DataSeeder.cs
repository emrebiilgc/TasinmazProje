using System.Text.Json;
using TasinmazProje.DataAccess.Context;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Seed
{
    public static class DataSeeder
    {
        public static void SeedFromJson(TasinmazDbContext context)
        {
            Console.WriteLine(">>> JSON'dan veri yükleme başlatıldı...");

            if (context.Cities.Any())
            {
                Console.WriteLine(">>> Veritabanı dolu, seed işlemi atlandı.");
                return;
            }

            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "SeedData");

            try
            {
                // ŞEHİRLER
                var cityJson = File.ReadAllText(Path.Combine(basePath, "il.json"));
                var cityRoot = JsonSerializer.Deserialize<JsonElement>(cityJson);

                var cityTable = cityRoot.EnumerateArray()
                    .FirstOrDefault(e => e.TryGetProperty("type", out var type) && type.GetString() == "table");

                var cities = cityTable
                    .GetProperty("data")
                    .EnumerateArray()
                    .Select(c => new City
                    {
                        Id = int.Parse(c.GetProperty("id").GetString() ?? "0"),
                        Name = c.GetProperty("name").GetString()?.Trim() ?? string.Empty
                    }).ToList();

                context.Cities.AddRange(cities);
                context.SaveChanges();
                Console.WriteLine($">>> {cities.Count} şehir yüklendi.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("!!! Şehir verisi yüklenirken hata oluştu: " + ex.Message);
            }

            try
            {
                // İLÇELER
                var districtJson = File.ReadAllText(Path.Combine(basePath, "ilce.json"));
                var districtRoot = JsonSerializer.Deserialize<JsonElement>(districtJson);

                var districtTable = districtRoot.EnumerateArray()
                    .FirstOrDefault(e => e.TryGetProperty("type", out var type) && type.GetString() == "table");

                var districts = districtTable
                    .GetProperty("data")
                    .EnumerateArray()
                    .Select(d => new District
                    {
                        Id = int.Parse(d.GetProperty("id").GetString() ?? "0"),
                        CityId = int.Parse(d.GetProperty("il_id").GetString() ?? "0"),
                        Name = d.GetProperty("name").GetString()?.Trim() ?? string.Empty
                    }).ToList();

                context.Districts.AddRange(districts);
                context.SaveChanges();
                Console.WriteLine($">>> {districts.Count} ilçe yüklendi.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("!!! İlçe verisi yüklenirken hata oluştu: " + ex.Message);
            }

            try
            {
                // KÖYLER → ilce_id eşleştirmesi için
                var koyJson = File.ReadAllText(Path.Combine(basePath, "koy.json"));
                var koyRoot = JsonSerializer.Deserialize<JsonElement>(koyJson);
                var koyTable = koyRoot.EnumerateArray()
                    .FirstOrDefault(e => e.TryGetProperty("type", out var type) && type.GetString() == "table");

                var koyDict = koyTable
                    .GetProperty("data")
                    .EnumerateArray()
                    .ToDictionary(
                        k => k.GetProperty("id").GetString() ?? "0",
                        k => new
                        {
                            IlceId = int.Parse(k.GetProperty("ilce_id").GetString() ?? "0"),
                            KoyAdi = k.GetProperty("name").GetString()?.Trim() ?? string.Empty
                        });

                // MAHALLELER (KÖYLERDEN GELİYOR)
                var mahalleJson = File.ReadAllText(Path.Combine(basePath, "mahalle.json"));
                var mahalleRoot = JsonSerializer.Deserialize<JsonElement>(mahalleJson);
                var mahalleTable = mahalleRoot.EnumerateArray()
                    .FirstOrDefault(e => e.TryGetProperty("type", out var type) && type.GetString() == "table");

                var neighborhoods = mahalleTable
                    .GetProperty("data")
                    .EnumerateArray()
                    .Select(m =>
                    {
                        var koyId = m.GetProperty("koy_id").GetString() ?? "0";
                        var name = m.GetProperty("name").GetString()?.Trim() ?? "";

                        if (!koyDict.ContainsKey(koyId))
                            return null; // eşleşmeyenleri atla

                        // Eğer ad "KÖYÜN KENDİSİ" ise → köy adını ata
                        if (name.ToUpper() == "KÖYÜN KENDİSİ")
                        {
                            name = koyDict[koyId].KoyAdi;
                        }

                        return new Neighborhood
                        {
                            Id = int.Parse(m.GetProperty("id").GetString() ?? "0"),
                            DistrictId = koyDict[koyId].IlceId,
                            Name = name
                        };
                    })
                    .Where(n => n != null)
                    .ToList();

                context.Neighborhoods.AddRange(neighborhoods);
                context.SaveChanges();
                Console.WriteLine($">>> {neighborhoods.Count} mahalle yüklendi.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("!!! Mahalle verisi yüklenirken hata oluştu: " + ex.Message);
            }

            Console.WriteLine(">>> JSON seed işlemi başarıyla tamamlandı.");
        }
    }
}
