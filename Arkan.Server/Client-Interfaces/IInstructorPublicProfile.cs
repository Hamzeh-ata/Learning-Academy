using Arkan.Server.PageModels.InstructorProfileModels;

namespace Arkan.Server.Client_Interfaces
{
    public interface IInstructorPublicProfile
    {
        Task<GetInstructorPublicProfile> GetProfileAsync(int InstructorId);
    }
}
