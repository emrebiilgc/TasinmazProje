using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasinmazProje.DataAccess.Migrations
{
    public partial class ChangeAdaParselToInt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Önce default constraint'ları kaldırıyoruz
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Parsel"" DROP DEFAULT;");
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Ada"" DROP DEFAULT;");

            // Sonra tip değişimi yapıyoruz
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Parsel"" TYPE integer USING ""Parsel""::integer;");
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Ada"" TYPE integer USING ""Ada""::integer;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Eski tipe geri dönerken yine default'ı kaldırıyoruz
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Parsel"" DROP DEFAULT;");
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Ada"" DROP DEFAULT;");

            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Parsel"" TYPE text USING ""Parsel""::text;");
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Ada"" TYPE text USING ""Ada""::text;");
        }
    }
}