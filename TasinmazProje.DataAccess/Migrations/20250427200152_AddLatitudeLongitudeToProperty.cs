using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasinmazProje.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddLatitudeLongitudeToProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Properties",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Properties",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Properties");
        }
    }
}
