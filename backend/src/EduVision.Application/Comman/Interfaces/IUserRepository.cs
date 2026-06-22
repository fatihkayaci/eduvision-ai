using EduVision.Domain.Entities;
using EduVision.Domain.Enums;

namespace EduVision.Application.Comman.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<SchoolMembership?> GetMembershipAsync(Guid userId, UserRole role, CancellationToken cancellationToken = default);
}
