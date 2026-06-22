namespace EduVision.Application.Comman.Interfaces;

public interface IPasswordHasher
{
    bool Verify(string password, string passwordHash);
}
