import React from 'react';
import { INavBarOptions } from '../Navigation/INavBarOptions';
import './ProfilePage.css';
import IProfile from './IProfile';
import Profile from '../Backend/Profile';
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { IPersonaSharedProps, Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import CardPage from '../UIPages/CardPage';

const DayPickerStrings: IDatePickerStrings = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker'
};

interface IProps {
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

interface IState {
    profile: IProfile | null,
    persona: IPersonaSharedProps | null,
    changed: boolean
}

class ProfilePage extends React.Component<IProps, IState>{

    profileBeforeChanges: IProfile | null = null;
    propertiesChanged: Array<String> = [];

    constructor(props: IProps) {
        super(props);

        this.state = {
            profile: null,
            persona: null,
            changed: false
        }

        this.props.setNavBarOptions!(new INavBarOptions("Profile", true));

        this.getProfile = this.getProfile.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeBirthDate = this.onChangeBirthDate.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.clearChanges = this.clearChanges.bind(this);
        this.submitChanges = this.submitChanges.bind(this);
    }

    componentDidMount() {
        this.getProfile();
    }

    async getProfile() {
        let profile = await Profile.Get();
        this.profileBeforeChanges = { ...profile };
        this.propertiesChanged = [];
        if (profile != null) {
            this.setState({ profile: { ...profile! }, changed: false });
            this.setState({ persona: { imageInitials: profile.firstName.charAt(0), imageUrl: profile.picture } });
        }
    }

    propertyChanged(propertyName: string, changedProfile: IProfile) {
        var profile_before: any = { ...this.profileBeforeChanges! };
        var profile_after: any = { ...changedProfile };


        if ((profile_before.hasOwnProperty(propertyName) && profile_after.hasOwnProperty(propertyName)) || profile_after.hasOwnProperty(propertyName)) {
            if (profile_before[propertyName] === profile_after[propertyName]) {
                if (this.propertiesChanged.includes(propertyName)) {
                    this.propertiesChanged.splice(this.propertiesChanged.indexOf(propertyName), 1);
                }
            }
            else {
                if (!this.propertiesChanged.includes(propertyName)) {
                    this.propertiesChanged.push(propertyName);
                }
            }
        }

        if (this.propertiesChanged.length === 0) {
            this.setState({ changed: false });
        }
        else {
            this.setState({ changed: true });
        }
    }

    onChangeFirstName(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        if (this.state.profile !== null) {
            var profile = this.state.profile;
            profile.firstName = newValue!;
            this.propertyChanged("firstName", profile);
            this.setState({ profile: profile });
        }
    }

    onChangeLastName(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        if (this.state.profile !== null) {
            var profile = this.state.profile;
            profile.lastName = newValue!;
            this.propertyChanged("lastName", profile);
            this.setState({ profile: profile });
        }
    }

    onChangeEmail(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        if (this.state.profile !== null) {
            var profile = this.state.profile;
            profile.email = newValue!;
            this.propertyChanged("email", profile);
            this.setState({ profile: profile });
        }
    }

    onChangeBirthDate(date: Date | null | undefined) {
        if (this.state.profile !== null && date !== null && date !== undefined) {
            var profile = this.state.profile;
            profile!.birthDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            this.propertyChanged("birthDate", profile);
            this.setState({ profile: profile });
        }
    }

    onChangeGender(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option?: IChoiceGroupOption | undefined) {
        if (this.state.profile !== null && option !== undefined) {
            var profile = this.state.profile;
            profile!.gender = option.key;
            this.propertyChanged("gender", profile);
            this.setState({ profile: profile });
        }
    }

    clearChanges() {
        this.propertiesChanged = [];
        this.setState({ profile: { ...this.profileBeforeChanges! }, changed: false })
    }

    async submitChanges() {
        if (this.state.profile !== null) {
            await Profile.Change(this.state.profile, this.propertiesChanged);
            await this.getProfile();
        }
    }

    formatDate(date: Date | undefined): string {
        if (date !== undefined) {
            return date.getUTCFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + (date.getDate())).slice(-2);
        }
        return "";
    }

    render() {
        return (
            <CardPage isLoading={this.state.profile == null || this.state.persona == null}>
                {
                    (this.state.profile !== null && this.state.persona !== null) &&
                    ([
                        <Persona
                            {...this.state.persona!}
                            size={PersonaSize.size72}
                            className="avatar"
                            style={{ boxShadow: Depths.depth64 }}
                        />,
                        <div className="profileContent">
                            <div className="profileInputs">
                                <div>
                                    <TextField
                                        label="First Name"
                                        value={this.state.profile!.firstName}
                                        onChange={this.onChangeFirstName}
                                        required
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Last Name"
                                        value={this.state.profile!.lastName}
                                        onChange={this.onChangeLastName}
                                        required
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Email"
                                        value={this.state.profile!.email}
                                        onChange={this.onChangeEmail}
                                        required
                                    />
                                </div>
                                <div>
                                    <DatePicker
                                        label="Birth Date"
                                        firstDayOfWeek={DayOfWeek.Sunday}
                                        formatDate={this.formatDate}
                                        strings={DayPickerStrings}
                                        placeholder="Select a date..."
                                        ariaLabel="Select a date"
                                        value={(this.state.profile!.birthDate !== undefined && this.state.profile!.birthDate !== null) ? new Date(this.state.profile!.birthDate) : undefined}
                                        onSelectDate={this.onChangeBirthDate}
                                    />
                                </div>
                                <div>
                                    <ChoiceGroup
                                        options={[
                                            {
                                                key: 'male',
                                                text: 'Male'
                                            },
                                            {
                                                key: 'female',
                                                text: 'Female',
                                            }
                                        ]}
                                        selectedKey={this.state.profile!.gender}
                                        onChange={this.onChangeGender}
                                        label="Gender:"
                                        required
                                    />

                                </div>
                            </div>
                            <div className="profileButtons">
                                <PrimaryButton
                                    className="buttons"
                                    disabled={!this.state.changed}
                                    text="Submit Changes"
                                    onClick={this.submitChanges}
                                    allowDisabledFocus={true}
                                />
                                <DefaultButton
                                    className="buttons"
                                    disabled={!this.state.changed}
                                    text="Clear Changes"
                                    onClick={this.clearChanges}
                                    allowDisabledFocus={true}
                                />
                            </div>
                        </div>
                    ])
                }
            </CardPage>
        );
    }
}

export default ProfilePage;