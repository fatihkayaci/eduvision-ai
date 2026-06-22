using EduVision.Application.Comman.Interfaces;

namespace EduVision.Infrastructure.Services;

public sealed class PasswordHasher : IPasswordHasher
{
    public bool Verify(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
