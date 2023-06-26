
export const UserEmailRules = [
      (v: string) => !!v || "Email is required",
      (v: string) => v.length >= 5 || "Email must be at least 5 characters",
      (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
    ];

export const PasswordRules = [
      (v: string) => !!v || "Password is required",
      (v: string) => v.length >= 4 || "Password must be at least 4 characters",
    ];

export const PasswordRegisterRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6|| "Password must be at least 6 characters",
  (v: string) => !/\s/.test(v) || "Password cannot contain spaces",
  (v: string) =>
    /[a-zA-Z]/.test(v) || "Password must contain at least 1 letter",
  (v: string) => /[0-9]/.test(v) || "Password must contain at least 1 number",
];

export const UserFirstnameRules = [
  (v: string) => !!v || "Firstname is required",
  (v: string) => v.length >= 2 || "Firstname must be at least 2 characters",
  (v: string) => !/\d/.test(v) || "Firstname cannot contain numbers",
];

export const UserLastnameRules = [
  (v: string) => !!v || "Lastname is required",
  (v: string) => v.length >= 2 || "Lastname must be at least 2 characters",
  (v: string) => !/\d/.test(v) || "Lastname cannot contain numbers",
];
