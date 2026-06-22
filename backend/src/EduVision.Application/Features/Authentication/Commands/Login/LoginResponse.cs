using EduVision.Domain.Enums;

namespace EduVision.Application.Features.Authentication.Commands.Login;

public sealed record LoginResponse(
    Guid UserId,
    string FirstName,
    string LastName,
    UserRole Role,
    string AccessToken,
    DateTimeOffset ExpiresAtUtc);
