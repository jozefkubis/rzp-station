"use client"

import FormInput from "./FormInput"
import UpdateUserButton from "./UpdateUserButton"

function UpdateUserDataForm() {
    return (
        <form className="w-full max-w-md rounded-lg p-8 space-y-6">
            <div className="flex flex-col">
                <FormInput
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    name="email"
                    disabled={true}
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="username"
                    type="text"
                    placeholder="Uživatelské meno"
                    name="username"
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="password"
                    type="password"
                    placeholder="Vaše heslo"
                    name="password"
                />
            </div>
            <UpdateUserButton />
        </form>
    )
}

export default UpdateUserDataForm
