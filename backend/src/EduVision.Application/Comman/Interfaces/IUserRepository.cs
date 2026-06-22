using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
}
