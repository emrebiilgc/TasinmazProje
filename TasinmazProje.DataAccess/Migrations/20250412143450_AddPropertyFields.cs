using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasinmazProje.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PropertyType",
                table: "Properties",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Parcel",
                table: "Properties",
                newName: "Parsel");

            migrationBuilder.RenameColumn(
                name: "Block",
                table: "Properties",
                newName: "Nitelik");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Properties",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "Ada",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Adres",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "Properties",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Properties",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Properties",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_CityId",
                table: "Properties",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_DistrictId",
                table: "Properties",
                column: "DistrictId");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Cities_CityId",
                table: "Properties",
                column: "CityId",
                principalTable: "Cities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Districts_DistrictId",
                table: "Properties",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Cities_CityId",
                table: "Properties");

            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Districts_DistrictId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_CityId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_DistrictId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Ada",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Adres",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Properties");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Properties",
                newName: "PropertyType");

            migrationBuilder.RenameColumn(
                name: "Parsel",
                table: "Properties",
                newName: "Parcel");

            migrationBuilder.RenameColumn(
                name: "Nitelik",
                table: "Properties",
                newName: "Block");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Properties",
                newName: "Address");
        }
    }
}
