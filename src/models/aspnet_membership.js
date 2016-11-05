let _membership = kendo.data.Model.define({
    id: "UserId",
    fields: {
        "UserId": { editable: true, type: "string" },
        "ApplicationId": { editable: true, type: "string" },
        "Password": { editable: true, type: "string" },
        "PasswordFormat": { editable: true, type: "number" },
        "PasswordSalt": { editable: true, type: "string" },
        "MobilePIN" : { editable: true, type: "string" },
        "Email": { editable: true, type: "string" },
        "LoweredEmail" : { editable: true, type: "string" },
        "PasswordQuestion" : { editable: true, type: "string" },
        "PasswordAnswer" : { editable: true, type: "string" },
        "IsApproved": { editable: true, type: "boolean" },
        "IsLockedOut": { editable: true, type: "boolean" },
        "CreateDate" : { editable: true, type: "date" },
        "LastLoginDate": { editable: true, type: "date" },
        "LastPasswordChangedDate": { editable: true, type: "date" },
        "LastLockoutDate": { editable: true, type: "date" },
        "FailedPasswordAttemptCount" : { editable: true, type: "number" },
        "FailedPasswordAttemptWindowStart": { editable: true, type: "date" },
        "FailedPasswordAnswerAttemptCount" : { editable: true, type: "number" },
        "FailedPasswordAnswerAttemptWindowStart": { editable: true, type: "date" },
        "SecurityAnswerOne": { editable: true, type: "string" },
        "SecurityQuestionOneId": { editable: true, type: "number" },
        "SecurityQuestionOne": { editable: true, type: "string" },
        "SecurityAnswerTwo": { editable: true, type: "string" },
        "SecurityQuestionTwoId": { editable: true, type: "number" },
        "SecurityQuestionTwo": { editable: true, type: "string" },
        "Comment": { editable: true, type: "string" },
        "AddressCompleteDateTime": { editable: true, type: "date" },
        "AlternateEmail": { editable: true, type: "string" }
    }
});

export default _membership;