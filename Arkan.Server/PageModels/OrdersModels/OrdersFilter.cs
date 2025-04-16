using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.OrdersModels
{
    public class OrdersFilter
    {
        public string SortBy { get; set; } = "Date";
        public string SortOrder { get; set; } = "Desc";
        public string? UserName {  get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
