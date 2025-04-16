namespace Arkan.Server.PageModels.RolesModels
{
    public class RolesModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int UsersCount {  get; set; }
    }


    public class RolesModelDto
    {
        public List<RolesModel> RolesModel {  get; set; }   
        public string Key { get; set; }
    }

}
