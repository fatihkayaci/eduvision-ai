using EduVision.Domain.Entities;
using EduVision.Domain.Enums;

namespace EduVision.Application.Comman.Interfaces;

public interface ITokenService
{
    AccessToken Create(User user, UserRole role, Guid schoolId);
}

public sealed record AccessToken(string Value, DateTimeOffset ExpiresAtUtc);
