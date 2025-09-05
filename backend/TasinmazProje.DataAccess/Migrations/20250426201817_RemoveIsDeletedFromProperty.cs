using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasinmazProje.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsDeletedFromProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Properties");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Properties",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
