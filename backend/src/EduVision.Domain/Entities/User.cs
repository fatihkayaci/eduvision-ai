namespace EduVision.Domain.Entities;

public sealed class User : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;

    public string NationalIdentityNumber { get; private set; } = string.Empty;

    public string PhoneNumber { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public bool IsSystemAdmin { get; private set; }

    public StudentProfile? StudentProfile { get; private set; }

    private User()
    {
    }

    public static User Create(
        string firstName,
        string lastName,
        string nationalIdentityNumber,
        string phoneNumber,
        string email,
        string passwordHash,
        bool isSystemAdmin = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(nationalIdentityNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(phoneNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);

        return new User
        {
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            NationalIdentityNumber = nationalIdentityNumber.Trim(),
            PhoneNumber = phoneNumber.Trim(),
            Email = email.Trim(),
            PasswordHash = passwordHash,
            IsSystemAdmin = isSystemAdmin
        };
    }
    public void AssignStudentProfile(string studentNumber)
    {
        StudentProfile = StudentProfile.Create(this.Id, studentNumber);
    }
}
