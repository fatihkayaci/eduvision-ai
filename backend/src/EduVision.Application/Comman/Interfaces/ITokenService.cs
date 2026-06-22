using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface ITokenService
{
    AccessToken Create(User user);
}

public sealed record AccessToken(string Value, DateTimeOffset ExpiresAtUtc);
