export const dateOfBirthToAge = (dob: string) => {
    const birthdateComponents = dob.split('-');
    return calculateAge(
        Number.parseInt(birthdateComponents[1], 10),
        Number.parseInt(birthdateComponents[2], 10),
        Number.parseInt(birthdateComponents[0], 10),
    );
};

const calculateAge = (birthMonth: number, birthDay: number, birthYear: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    let calculatedAge = currentYear - birthYear;

    if (currentMonth < birthMonth - 1) {
        calculatedAge--;
    }
    if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
        calculatedAge--;
    }
    return calculatedAge;
};
