import { i18n as i18nEn } from './generated-en'
const web = {
    "lang": "el",
    "openInSonolus": "Άνοιγμα στο Sonolus",
    "optionNotSupported": "This option is not supported on web. Please use Sonolus app.",
    "loggedIn": "Signed in as: ",
    "logIn": "Click the following link to sign in with Sonolus.",
    "logInTimedOut": "Sign in timed out.",
    "logInRetry": "Retry",
    "notFound": "Η σελίδα που ψάχνεις δεν είναι εδώ :("
} as const
const app = {
    meta: {
        name: "el",
        title: "Ελληνικά (Greek)",
    },
    common: {
        more: "Περισσότερα",
        on: "ΕΝΕΡΓΟΠΟΙΗΜΕΝΟ",
        off: "ΑΠΕΝΕΡΓΟΠΟΙΗΜΕΝΟ",
        none: "None",
        select: "Επιλογή",
        create: "Create",
        submit: "Submit",
        cancel: "Ματαίωση",
        confirm: "Επιβεβαίωση",
        search: "Αναζήτηση",
        requiredOption: "This is a required option.",
        multiField: {
            selected: (a0: string) => "{0} Selected".replace('{0}', a0),
            allSelected: "All Selected",
            selectAll: "Select All",
            selectNone: "Select None",
        },
        fileField: {
            noSelected: "No file selected",
            validation: {
                invalid: "Invalid file.\n\nPlease select a different file.",
                minSize: "File too small.\n\nPlease select a different file.",
                maxSize: "File too large.\n\nPlease select a different file.",
                image: {
                    minWidth: "Image width too small.\n\nPlease select a different file.",
                    maxWidth: "Image width too large.\n\nPlease select a different file.",
                    minHeight: "Image height too small.\n\nPlease select a different file.",
                    maxHeight: "Image height too large.\n\nPlease select a different file.",
                },
                audio: {
                    minLength: "Audio length too short.\n\nPlease select a different file.",
                    maxLength: "Audio length too long.\n\nPlease select a different file.",
                },
            },
        },
    },
    clients: {
        customServer: {
            server: {
                info: {
                    loading: "Φόρτωση πληροφοριών διακομιστή...",
                    error: (a0: string) => "Απέτυχε η φόρτωση των πληροφοριών διακομιστή του \"{0}\".\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
            },
            room: {
                info: {
                    loading: "Loading rooms info...",
                    error: (a0: string) => "Failed to load rooms info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating room...",
                    error: (a0: string) => "Failed to create room in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Loading rooms...",
                    error: (a0: string) => "Failed to load rooms at page {0}.".replace('{0}', a0),
                },
                details: {
                    loading: "Loading room details...",
                    error: (a0: string) => "Failed to load room details of \"{0}\".".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to room...",
                    error: (a0: string) => "Failed to submit to room \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading room community info...",
                    },
                    submit: {
                        loading: "Submitting to room community...",
                        error: (a0: string) => "Failed to submit to room community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading room comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading room leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading room records...",
                        },
                        details: {
                            loading: "Loading room record details...",
                        },
                    },
                },
            },
            post: {
                info: {
                    loading: "Loading posts info...",
                    error: (a0: string) => "Failed to load posts info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating post...",
                    error: (a0: string) => "Failed to create post in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Loading posts...",
                    error: (a0: string) => "Failed to load posts at page {0}.".replace('{0}', a0),
                },
                details: {
                    loading: "Loading post details...",
                    error: (a0: string) => "Failed to load post details of \"{0}\".".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to post...",
                    error: (a0: string) => "Failed to submit to post \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading post community info...",
                    },
                    submit: {
                        loading: "Submitting to post community...",
                        error: (a0: string) => "Failed to submit to post community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading post comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading post leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading post records...",
                        },
                        details: {
                            loading: "Loading post record details...",
                        },
                    },
                },
            },
            playlist: {
                info: {
                    loading: "Loading playlists info...",
                    error: (a0: string) => "Failed to load playlists info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating playlist...",
                    error: (a0: string) => "Failed to create playlist in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Loading playlists...",
                    error: (a0: string) => "Failed to load playlists at page {0}.".replace('{0}', a0),
                },
                details: {
                    loading: "Loading playlist details...",
                    error: (a0: string) => "Failed to load playlist details of \"{0}\".".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to playlist...",
                    error: (a0: string) => "Failed to submit to playlist \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading playlist community info...",
                    },
                    submit: {
                        loading: "Submitting to playlist community...",
                        error: (a0: string) => "Failed to submit to playlist community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading playlist comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading playlist leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading playlist records...",
                        },
                        details: {
                            loading: "Loading playlist record details...",
                        },
                    },
                },
            },
            level: {
                info: {
                    loading: "Loading levels info...",
                    error: (a0: string) => "Failed to load levels info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating level...",
                    error: (a0: string) => "Failed to create level in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Φόρτωση επιπέδων...",
                    error: (a0: string) => "Η φόρτωση των τραγουδιών στη σελίδα {0} απέτυχε.\n\nΠαρακαλούμε ελέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                details: {
                    loading: "Φόρτωση λεπτομερειών τραγουδιού...",
                    error: (a0: string) => "Απέτυχε η φόρτωση των λεπτομερειών επιπέδου του \"{0}\".\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to level...",
                    error: (a0: string) => "Failed to submit to level \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading level community info...",
                    },
                    submit: {
                        loading: "Submitting to level community...",
                        error: (a0: string) => "Failed to submit to level community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading level comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading level leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading level records...",
                        },
                        details: {
                            loading: "Loading level record details...",
                        },
                    },
                },
            },
            replay: {
                info: {
                    loading: "Loading replays info...",
                    error: (a0: string) => "Failed to load replays info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating replay...",
                    error: (a0: string) => "Failed to create replay in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Loading replays...",
                    error: (a0: string) => "Failed to load replays at page {0}.".replace('{0}', a0),
                },
                details: {
                    loading: "Loading replay details...",
                    error: (a0: string) => "Failed to load replay details of \"{0}\".".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to replay...",
                    error: (a0: string) => "Failed to submit to replay \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading replay community info...",
                    },
                    submit: {
                        loading: "Submitting to replay community...",
                        error: (a0: string) => "Failed to submit to replay community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading replay comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading replay leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading replay records...",
                        },
                        details: {
                            loading: "Loading replay record details...",
                        },
                    },
                },
            },
            skin: {
                info: {
                    loading: "Loading skins info...",
                    error: (a0: string) => "Failed to load skins info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating skin...",
                    error: (a0: string) => "Failed to create skin in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Φόρτωση γραφικών...",
                    error: (a0: string) => "Απέτυχε η φόρτωση των εμφανίσεων στη σελίδα {0}.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                details: {
                    loading: "Φόρτωση λεπτομερειών γραφικών...",
                    error: (a0: string) => "Η φόρτωση των λεπτομερειών των γραφικών του \"{0}\" απέτυχε.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to skin...",
                    error: (a0: string) => "Failed to submit to skin \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading skin community info...",
                    },
                    submit: {
                        loading: "Submitting to skin community...",
                        error: (a0: string) => "Failed to submit to skin community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading skin comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading skin leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading skin records...",
                        },
                        details: {
                            loading: "Loading skin record details...",
                        },
                    },
                },
            },
            background: {
                info: {
                    loading: "Loading backgrounds info...",
                    error: (a0: string) => "Failed to load backgrounds info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating background...",
                    error: (a0: string) => "Failed to create background in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Φόρτωση φόντου...",
                    error: (a0: string) => "Η φόρτωση του φόντου στη σελίδα {0} απέτυχε.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                details: {
                    loading: "Φόρτωση λεπτομερειών φόντου...",
                    error: (a0: string) => "Η φόρτωση των λεπτομερειών παρασκηνίου του \"{0}\" απέτυχε.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to background...",
                    error: (a0: string) => "Failed to submit to background \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading background community info...",
                    },
                    submit: {
                        loading: "Submitting to background community...",
                        error: (a0: string) => "Failed to submit to background community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading background comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading background leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading background records...",
                        },
                        details: {
                            loading: "Loading background record details...",
                        },
                    },
                },
            },
            effect: {
                info: {
                    loading: "Loading SFX info...",
                    error: (a0: string) => "Failed to load SFX info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating SFX...",
                    error: (a0: string) => "Failed to create SFX in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Φόρτωση SFX...",
                    error: (a0: string) => "Απέτυχε η φόρτωση του SFX στη σελίδα {0}.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                details: {
                    loading: "Φόρτωση λεπτομερειών SFX...",
                    error: (a0: string) => "Απέτυχε η φόρτωση των στοιχείων SFX του \"{0}\".\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to SFX...",
                    error: (a0: string) => "Failed to submit to SFX \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading SFX community info...",
                    },
                    submit: {
                        loading: "Submitting to SFX community...",
                        error: (a0: string) => "Failed to submit to SFX community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading SFX comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading SFX leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading SFX records...",
                        },
                        details: {
                            loading: "Loading SFX record details...",
                        },
                    },
                },
            },
            particle: {
                info: {
                    loading: "Loading particles info...",
                    error: (a0: string) => "Failed to load particles info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating particle...",
                    error: (a0: string) => "Failed to create particle in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Φόρτωση σωματιδίων...",
                    error: (a0: string) => "Αποτυχία φόρτωσης σωματιδίων στη σελίδα {0}.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                details: {
                    loading: "Φόρτωση λεπτομερειών σωματιδίων...",
                    error: (a0: string) => "Απέτυχε η φόρτωση των λεπτομερειών σωματιδίων του \"{0}\".\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to particle...",
                    error: (a0: string) => "Failed to submit to particle \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading particle community info...",
                    },
                    submit: {
                        loading: "Submitting to particle community...",
                        error: (a0: string) => "Failed to submit to particle community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading particle comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading particle leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading particle records...",
                        },
                        details: {
                            loading: "Loading particle record details...",
                        },
                    },
                },
            },
            engine: {
                info: {
                    loading: "Loading engines info...",
                    error: (a0: string) => "Failed to load engines info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating engine...",
                    error: (a0: string) => "Failed to create engine in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Φόρτωση κινητήρων...",
                    error: (a0: string) => "Αποτυχία φόρτωσης μηχανών στη σελίδα {0}.\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                details: {
                    loading: "Φόρτωση λεπτομερειών κινητήρα...",
                    error: (a0: string) => "Απέτυχε η φόρτωση των λεπτομερειών του κινητήρα του \"{0}\".\n\nΕλέγξτε τη σύνδεσή σας στο διαδίκτυο και δοκιμάστε ξανά ή επικοινωνήστε με τον ιδιοκτήτη του διακομιστή για να αναφέρετε το πρόβλημα.".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to engine...",
                    error: (a0: string) => "Failed to submit to engine \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading engine community info...",
                    },
                    submit: {
                        loading: "Submitting to engine community...",
                        error: (a0: string) => "Failed to submit to engine community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading engine comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading engine leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading engine records...",
                        },
                        details: {
                            loading: "Loading engine record details...",
                        },
                    },
                },
            },
            user: {
                info: {
                    loading: "Loading users info...",
                    error: (a0: string) => "Failed to load users info of \"{0}\".".replace('{0}', a0),
                },
                create: {
                    loading: "Creating user...",
                    error: (a0: string) => "Failed to create user in \"{0}\".".replace('{0}', a0),
                },
                list: {
                    loading: "Loading users...",
                    error: (a0: string) => "Failed to load users at page {0}.".replace('{0}', a0),
                },
                details: {
                    loading: "Loading user details...",
                    error: (a0: string) => "Failed to load user details of \"{0}\".".replace('{0}', a0),
                },
                submit: {
                    loading: "Submitting to user...",
                    error: (a0: string) => "Failed to submit to user \"{0}\".".replace('{0}', a0),
                },
                community: {
                    info: {
                        loading: "Loading user community info...",
                    },
                    submit: {
                        loading: "Submitting to user community...",
                        error: (a0: string) => "Failed to submit to user community of \"{0}\".".replace('{0}', a0),
                    },
                    comment: {
                        list: {
                            loading: "Loading user comments...",
                        },
                    },
                },
                leaderboard: {
                    details: {
                        loading: "Loading user leaderboard details...",
                    },
                    record: {
                        list: {
                            loading: "Loading user records...",
                        },
                        details: {
                            loading: "Loading user record details...",
                        },
                    },
                },
            },
        },
    },
    routes: {
        server: {
            home: {
                login: "Sign In",
                logout: "Sign Out",
                post: "Posts",
                playlist: "Playlists",
                level: "Levels",
                replay: "Replays",
                skin: "Skins",
                background: "Backgrounds",
                effect: "SFX",
                particle: "Particles",
                engine: "Engines",
                user: "Users",
                room: "Rooms",
                configuration: "Configuration",
            },
            search: {
                title: "Αναζήτηση",
            },
            forms: {
                validationError: "Some required information is missing.\n\nPlease complete missing fields and try again.",
                confirmation: (a0: string) => "Are you sure to submit \"{0}\"?".replace('{0}', a0),
            },
            infos: {
                advanced: "Advanced",
                room: {
                    title: "Rooms",
                },
                post: {
                    title: "Posts",
                },
                playlist: {
                    title: "Playlists",
                },
                level: {
                    title: "Levels",
                },
                replay: {
                    title: "Replays",
                },
                skin: {
                    title: "Skins",
                },
                background: {
                    title: "Backgrounds",
                },
                effect: {
                    title: "SFX",
                },
                particle: {
                    title: "Particles",
                },
                engine: {
                    title: "Engines",
                },
                user: {
                    title: "Users",
                },
            },
            lists: {
                room: {
                    title: "Rooms",
                },
                post: {
                    title: "Posts",
                },
                playlist: {
                    title: "Playlists",
                },
                level: {
                    title: "Επίπεδα",
                },
                replay: {
                    title: "Replays",
                },
                skin: {
                    title: "Δέρματα",
                },
                background: {
                    title: "Φόντο",
                },
                effect: {
                    title: "SFX",
                },
                particle: {
                    title: "Σωματίδια",
                },
                engine: {
                    title: "Μηχανές",
                },
                user: {
                    title: "Users",
                },
            },
            details: {
                tags: {
                    title: "Tags",
                    noTags: "No tags",
                },
                description: {
                    title: "Περιγραφή",
                    noDescription: "No description",
                },
                community: {
                    title: "Community",
                    noComments: "No comments",
                },
                leaderboard: {
                    title: "Leaderboard",
                    noRecords: "No records",
                    noReplays: "No replays",
                },
                playlist: {
                    levels: {
                        title: "Levels",
                    },
                },
                level: {
                    engine: {
                        title: "Engine",
                    },
                },
                engine: {
                    skin: {
                        title: "Skin",
                    },
                    background: {
                        title: "Background",
                    },
                    effect: {
                        title: "SFX",
                    },
                    particle: {
                        title: "Particle",
                    },
                },
                replay: {
                    level: {
                        title: "Level",
                    },
                },
            },
        },
        jumpToPage: {
            title: "Μετάβαση στη Σελίδα",
            page: {
                placeholder: "Enter page number...",
            },
            jump: "Αλμα",
        },
        settings: {
            ui: {
                contentLocalization: {
                    title: "Content Language",
                    description: "Language to use for content. Custom servers may provide content in this language if available.",
                },
            },
        },
    },
} as const
const texts: Record<string, string> = {}

export const i18n = {
    ...web,
    ...app,
    texts: { ...i18nEn.texts, ...texts },
}
export type I18n = typeof i18n