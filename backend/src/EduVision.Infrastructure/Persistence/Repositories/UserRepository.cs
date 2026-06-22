using EduVision.Application.Comman.Interfaces;
using EduVision.Domain.Entities;
using EduVision.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence.Repositories;

public sealed class UserRepository(ApplicationDbContext dbContext) : IUserRepository
{
    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        return dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(
                user => user.Email == email.Trim(),
                cancellationToken);
    }

    public Task<SchoolMembership?> GetMembershipAsync(Guid userId, UserRole role, CancellationToken cancellationToken = default)
    {
        return dbContext.SchoolMemberships
            .AsNoTracking()
            .SingleOrDefaultAsync(m => m.UserId == userId && m.Role == role, cancellationToken);
    }
}
