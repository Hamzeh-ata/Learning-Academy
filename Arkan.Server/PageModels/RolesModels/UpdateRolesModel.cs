namespace Arkan.Server.PageModels.RolesModels
{
    public class UpdateRolesModel
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public int UsersCount { get; set; }
        public string Key { get; set; }
    }
}
