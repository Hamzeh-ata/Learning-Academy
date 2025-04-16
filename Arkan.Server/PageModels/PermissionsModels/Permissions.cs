using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.PermissionsModels
{
    public static class Permissions
    {
        public static List<string> GenrateGenralPermissionsList(string module)
        {
            return new List<string>
            {
                $"Permissions.{module}.View",
                $"Permissions.{module}.Create",
                $"Permissions.{module}.Edit",
                $"Permissions.{module}.Delete",
            };

        }
        public static List<string> GenerateAllPermissions()
        {
            var AllPermissions = new List<string>();

            var moudles = Enum.GetValues(typeof(Modules));

            foreach (var moudle in moudles)
            {
                AllPermissions.AddRange(GenrateGenralPermissionsList(moudle.ToString()));
            }

            return AllPermissions;
        }
    }
}
