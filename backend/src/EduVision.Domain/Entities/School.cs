using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class School : BaseEntity
{

    public string Name { get; private set; } = string.Empty;

    public string Code { get; private set; } = string.Empty;

    private School()
    {
    }

    public static School Create(string name, string code)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new DomainValidationException("School name cannot be empty.");
        if (string.IsNullOrWhiteSpace(code)) throw new DomainValidationException("School code cannot be empty.");

        return new School
        {
            Name = name.Trim(),
            Code = code.Trim().ToUpperInvariant()
        };
    }
}
