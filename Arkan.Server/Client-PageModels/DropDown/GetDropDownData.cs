using Arkan.Server.Helpers;

namespace Arkan.Server.Client_PageModels.DropDown
{
    public class GetDropDownData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? UserId {  get; set; }
    }

    public class TypedDropDownResponse
    {
        public string Type { get; set; }
        public List<GetDropDownData> Data { get; set; }
    }

}
