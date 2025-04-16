using Arkan.Server.Client_PageModels.DropDown;
using Arkan.Server.Helpers;

namespace Arkan.Server.Client_Interfaces
{
    public interface IDropDown
    {
        Task<TypedDropDownResponse> GetData(GetDropDown model);
    }
}
