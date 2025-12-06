import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    '1aeb4083eb25b2d04870fc4dbad0cd6e': {
                        table: 'sys_app_module'
                        id: '1aeb4083eb25b2d04870fc4dbad0cd6e'
                    }
                    '53468403ebe1b2d04870fc4dbad0cd13': {
                        table: 'sys_app_module'
                        id: '53468403ebe1b2d04870fc4dbad0cd13'
                    }
                    '5496c843ebe1b2d04870fc4dbad0cd54': {
                        table: 'sys_app_module'
                        id: '5496c843ebe1b2d04870fc4dbad0cd54'
                    }
                    '86268ccfeba1b2d04870fc4dbad0cd91': {
                        table: 'sys_app_application'
                        id: '86268ccfeba1b2d04870fc4dbad0cd91'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '0b1c09837e164610a8f78009f5e0c2f0'
                    }
                    'clv-dashboard': {
                        table: 'sys_ui_page'
                        id: 'c79472a9feaf4df0b2506cc5da3fc491'
                    }
                    eba344c7eba1b2d04870fc4dbad0cd0b: {
                        table: 'sys_app_module'
                        id: 'eba344c7eba1b2d04870fc4dbad0cd0b'
                        deleted: true
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '5c56f084d96149da8e859a7626ffc839'
                    }
                    'x_hete_clvmaximi_0/main': {
                        table: 'sys_ux_lib_asset'
                        id: '6800f4730abb49308f526b2d14d50322'
                    }
                    'x_hete_clvmaximi_0/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: '0de6cf46dc264d3ba4c939822a736ac5'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '0240efd204a747f39a7edeaad06b7e9d'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policy_value'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '03a304c7eba1b2d04870fc4dbad0cd0c'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_credit_inquiries__last_6m_'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '03a304c7eba1b2d04870fc4dbad0cd23'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_number_of_engagements'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '079981d9729b4769b8c73d7c267ceba3'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'churn_risk'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '07a304c7eba1b2d04870fc4dbad0cd1d'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_website_visits__30_days_'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '087cd706dfcd4b2b954cf346fb76c146'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                            value: 'bronze'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0ba304c7eba1b2d04870fc4dbad0cd17'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_preferred_channel'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0ba304c7eba1b2d04870fc4dbad0cd2e'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_location'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0fa304c7eba1b2d04870fc4dbad0cd11'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_number_of_closed_accounts'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0fa304c7eba1b2d04870fc4dbad0cd28'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_avg_session_time__min_'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '111d0726368f4788b2577eed10054ebb'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'payment_frequency'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '17d02880deac432d88314e386701f6b9'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'renewal_date'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '19d38608ab93456985be790330fce873'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'status'
                            value: 'renewed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '19f9a854daab43778ca2425bdfce2c6c'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policyid'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '1b25000feba1b2d04870fc4dbad0cdd4'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1ee4c62c68af4004b7b0d1dd4a9c0853'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'delinquency_12m'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1f02d713689548169f25d88ccb1183b9'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'claims_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '2621c44feb61b2d04870fc4dbad0cdf4'
                        key: {
                            name: 'x_hete_clvmaximi_0.agent'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2658b3d3486d4ce5ba33121b9ddc3387'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'churn_risk'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26d7d47abf274cf9a30166ea400bfdce'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policyholderid'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2835400feba1b2d04870fc4dbad0cde0'
                        key: {
                            sys_security_acl: 'd835400feba1b2d04870fc4dbad0cdd9'
                            sys_user_role: {
                                id: '2621c44feb61b2d04870fc4dbad0cdf4'
                                key: {
                                    name: 'x_hete_clvmaximi_0.agent'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2835400feba1b2d04870fc4dbad0cdee'
                        key: {
                            sys_security_acl: 'e835400feba1b2d04870fc4dbad0cde7'
                            sys_user_role: {
                                id: '2621c44feb61b2d04870fc4dbad0cdf4'
                                key: {
                                    name: 'x_hete_clvmaximi_0.agent'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2a84c08beba1b2d04870fc4dbad0cd6c'
                        key: {
                            sys_security_acl: 'ea84c08beba1b2d04870fc4dbad0cd65'
                            sys_user_role: {
                                id: '2621c44feb61b2d04870fc4dbad0cdf4'
                                key: {
                                    name: 'x_hete_clvmaximi_0.agent'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2a84c08beba1b2d04870fc4dbad0cd7a'
                        key: {
                            sys_security_acl: 'ea84c08beba1b2d04870fc4dbad0cd73'
                            sys_user_role: {
                                id: '2621c44feb61b2d04870fc4dbad0cdf4'
                                key: {
                                    name: 'x_hete_clvmaximi_0.agent'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '301c3b990eae4477a4b6db8f8da88db2'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'clv_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '301e3dab0db5446aa717e1b746a08af0'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'email'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '30f7591c50bf4e6995170437055a053c'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'premium_annual'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '318371cf096f4ba083dc1066560bad92'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'credit_score'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3184808beba1b2d04870fc4dbad0cd8c'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'bankruptcies_flag'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd15'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'policyholder_id'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd16'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'location'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd17'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'tier'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd18'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'tenure_months'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd19'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'website_visits_30_days'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd1a'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'avg_session_time_min'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31848487eba1b2d04870fc4dbad0cd1b'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'number_of_open_accounts'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '354469f6c5e44f3e978ea802093c37b6'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'tenure_in_months'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3584808beba1b2d04870fc4dbad0cd8c'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'number_of_engagements'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '35848487eba1b2d04870fc4dbad0cd16'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'clv_score'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '35848487eba1b2d04870fc4dbad0cd17'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'risk_level'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '35848487eba1b2d04870fc4dbad0cd18'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'email'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '35848487eba1b2d04870fc4dbad0cd19'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'app_sessions_30_days'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '35848487eba1b2d04870fc4dbad0cd1a'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'credit_score'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3984808beba1b2d04870fc4dbad0cd8b'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'number_of_closed_accounts'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '39848487eba1b2d04870fc4dbad0cd15'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'first_name'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '39848487eba1b2d04870fc4dbad0cd16'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'churn_risk'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '39848487eba1b2d04870fc4dbad0cd17'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'missing_coverage'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '39848487eba1b2d04870fc4dbad0cd18'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'phone'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '39848487eba1b2d04870fc4dbad0cd19'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'quote_views'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '39848487eba1b2d04870fc4dbad0cd1a'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'delinquency_12m'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3af32b4db0124caebd02f5b749294630'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'risk_level'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3c37c96bdf4c43ef8c43752a775d9088'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'phone'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3c64a0efadab4ddda36155d6c445a393'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'app_sessions_30_days'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d84808beba1b2d04870fc4dbad0cd8b'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'credit_inquiries_last_6m'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d848487eba1b2d04870fc4dbad0cd15'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'last_name'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d848487eba1b2d04870fc4dbad0cd16'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'clv'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d848487eba1b2d04870fc4dbad0cd17'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'age'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d848487eba1b2d04870fc4dbad0cd18'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'preferred_channel'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d848487eba1b2d04870fc4dbad0cd19'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'abandoned_journeys'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3d848487eba1b2d04870fc4dbad0cd1a'
                        key: {
                            list_id: {
                                id: 'bd848487eba1b2d04870fc4dbad0cd13'
                                key: {
                                    name: 'x_hete_clvmaximi_0_policy_holder'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'credit_utilization_percent'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4074c44beba1b2d04870fc4dbad0cd96'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '40f379bf4d7243c1aeb96f25cb3bc63a'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'first_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '427d9da5ce1b4b96ba318554b2308084'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'avg_session_time_min'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '43a304c7eba1b2d04870fc4dbad0cd16'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_missing_coverage'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '43a304c7eba1b2d04870fc4dbad0cd2d'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_last_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '43b72cfcd3eb41d2bbb0d8cdc258e276'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'quote_views'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '47a304c7eba1b2d04870fc4dbad0cd10'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_abandoned_journeys'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '47a304c7eba1b2d04870fc4dbad0cd27'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_bankruptcies_flag'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '49188a00cd6a45898cd421946dfeb90f'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'clv_score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4ba304c7eba1b2d04870fc4dbad0cd0a'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_churn_risk____'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4ba304c7eba1b2d04870fc4dbad0cd21'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_clv_score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4fa304c7eba1b2d04870fc4dbad0cd1b'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_age'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '50c9277922fa48fd8a959a7e99709a14'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5835400feba1b2d04870fc4dbad0cdc5'
                        key: {
                            sys_security_acl: '9435400feba1b2d04870fc4dbad0cdbe'
                            sys_user_role: {
                                id: '2621c44feb61b2d04870fc4dbad0cdf4'
                                key: {
                                    name: 'x_hete_clvmaximi_0.agent'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '58e410cbe638445dbe740341715110c6'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policyid'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5a31fcb479494d7d93c09b0a7216d9a3'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'premium_amount'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5ca268ef4d0245018a48d327b7f5d81c'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'bankruptcies_flag'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '615ae8e11af14b208110dd4517558204'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'number_of_closed_accounts'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '626d1cc35dc643ed9e09f8ad75743826'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'phone'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '679a146183574e4ba172051f1119e797'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'clv'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6ac5d8ef3b4c45c9998ffe4b49eba484'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'avg_session_time_min'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6be18be16c0742ce9594698fce820d45'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'risk_level'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d9a750443a04ff0919f6e331d68220d'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'effective_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6dc0e83282314a86a9358a75b3445020'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'abandoned_journeys'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e6650382dc845469b57b92762838ef9'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'credit_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7be2f9172108419e9682efa05ebf61da'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'website_visits_30_days'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '801d4f453c5d4a58991ae5a0e40e03df'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'status'
                            value: 'expired'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '82629840b2a246719b87a51633272396'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policyholderid'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8310d449432b4cc6a94979944471a41b'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '83a304c7eba1b2d04870fc4dbad0cd09'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_email'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '83a304c7eba1b2d04870fc4dbad0cd20'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_clv____'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '843b6891120d42b29dc5e297ed13803a'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                            value: 'gold'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87a304c7eba1b2d04870fc4dbad0cd02'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87a304c7eba1b2d04870fc4dbad0cd1a'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_credit_score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87e3539380124e7e88361b7d6770d892'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'location'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '88bc58ff33974de6bc91ff2dc36d5492'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'risk_level'
                            value: 'medium'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '89d9e422f3074b5cbb3e851057792557'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'clv'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8a718f9a1e664ea483012a7263eeff66'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'app_sessions_30_days'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8ab3996d135240978a669102d83f16c1'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tenure_months'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8ba304c7eba1b2d04870fc4dbad0cd14'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_number_of_open_accounts'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8ba304c7eba1b2d04870fc4dbad0cd2b'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_app_sessions__30_days_'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8cee582bbdd2418a9a728763019de198'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'missing_coverage'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8f407b38a3904514a7afe7c6ec6c2b8f'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'number_of_engagements'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8fa304c7eba1b2d04870fc4dbad0cd0e'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_delinquency_12m'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8fa304c7eba1b2d04870fc4dbad0cd25'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_quote_views'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '9174484beba1b2d04870fc4dbad0cdef'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'risk_level'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '917edf0c8b6146339f7450c3370278c2'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'number_of_engagements'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '920156b54db94c4da6b648e746ae1fb6'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'number_of_closed_accounts'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9318cb80285647a7bd0bdfaa38901b60'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'abandoned_journeys'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9561fd5fce184e8d9a95c48f6f888972'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9564b0279b42433e9464a82cf9f7129f'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'preferred_channel'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '97d4031a14284924a1830267fcc5f51d'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'email'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '99f05510dc94462983d2a798111da4e3'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9a67ee9172e54923aebb9663f0d536be'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'status'
                            value: 'active'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9b76b4a7bf224eb78e9751cd49069343'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'missing_coverage'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9e3a3b8ea7024959986cc696cd06f7d3'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'location'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a625cccbeba1b2d04870fc4dbad0cddc'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aa03b3dd160b4bfcbab385922a81fe97'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'number_of_open_accounts'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ab9e925788674519afcbc8be06877a76'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                            value: 'silver'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'abcd986fbbd3439e9f5cce597961ad15'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'delinquency_12m'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'abea1c859d4f4ae59391d44433cf6abd'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'last_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ae8c12d083d64d85866a0b8f54552417'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'number_of_open_accounts'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b00ec6ac51a84513b1c3f265ab453014'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'premium_annual'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b04e8f51fa4547a1b3f19e7f9ad79a7d'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'credit_inquiries_last_6m'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b0d8d23a3667450bb8456f90c45e19fc'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'age'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b1d6c0fa65964c47a8179f7db411a4bf'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'quote_views'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b287399d7cda4ea8b34a1f1a055700b0'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b43c04bd48e945b683fb2ec7dcbe0036'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b609571fc71a44a689f84f28ab4ce7b9'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                            value: 'Platinum'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b74b0b4ddb434950899f09e42c89fe2f'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policy_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b790815c23a048178e7ef48b9e8fc245'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'website_visits_30_days'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'b95eba1b5b374f638c96ba3b75f4f9c7'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bb52363c5f7947b4a58195091f04473a'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'tenure_in_months'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bcbae01f0f894c9c869d088499059f71'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'risk_level'
                            value: 'high'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'bd848487eba1b2d04870fc4dbad0cd13'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bdf1149290824d87a98281c555a4d1f9'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'first_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c3a304c7eba1b2d04870fc4dbad0cd13'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_phone'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c3a304c7eba1b2d04870fc4dbad0cd2a'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_tenure__months_'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c5c44a6c2bda46eab645c1e06269950f'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'claims_count'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c6dda32396964234b2d00353e42428d6'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'policyholder_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c7a098970c4e46f9b74f015b1cd6d483'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'renewal_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c7a304c7eba1b2d04870fc4dbad0cd07'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_risk_level'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c7a304c7eba1b2d04870fc4dbad0cd0d'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_first_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c7a304c7eba1b2d04870fc4dbad0cd24'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_policyholder_id'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c874c44beba1b2d04870fc4dbad0cda6'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cb020a95392e41518da6609560b1704e'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cba304c7eba1b2d04870fc4dbad0cd1e'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_tier'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cfa304c7eba1b2d04870fc4dbad0cd18'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                            element: 'u_credit_utilization_percent'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd0f89087530847e2a51c5652b4b5e6bc'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'age'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd17ddfe135cb4e90a0554d63212d5707'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policy_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'd38558abe0bf4ca7a7879948ce692302'
                        key: {
                            logical_table_name: 'x_hete_clvmaximi_0_sold_policy'
                            col_name_string: 'policyholderid'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd3e39ee4156c4715bc37d8c3162ed4cf'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'payment_frequency'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd48aa76646c044ff8899e4ead01d4aa1'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'preferred_channel'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd4b354967e6d4cf88f4ef09157e9fae9'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'credit_inquiries_last_6m'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd518896e343e4215942cb1911d6319b3'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policynumber'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'd974484beba1b2d04870fc4dbad0cdcc'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dbd623297bc24b1c863e741c01378a09'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'credit_utilization_percent'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df037b0e9a21456da18b0e2c4c741b3e'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policy_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e0c102368a5942dd9bb47740021cf901'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'last_name'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e325cccbeba1b2d04870fc4dbad0cd9f'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'policyid'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e325cccbeba1b2d04870fc4dbad0cda0'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'premium_annual'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e325cccbeba1b2d04870fc4dbad0cda1'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e325cccbeba1b2d04870fc4dbad0cda2'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'tenure_in_months'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e690a529cff34deeab7023d364c2bf74'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tenure_months'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e725cccbeba1b2d04870fc4dbad0cd9f'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'policyholderid'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e725cccbeba1b2d04870fc4dbad0cda0'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'effective_date'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e725cccbeba1b2d04870fc4dbad0cda1'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'premium_amount'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'eb25cccbeba1b2d04870fc4dbad0cd9f'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'policynumber'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'eb25cccbeba1b2d04870fc4dbad0cda0'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'renewal_date'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'eb25cccbeba1b2d04870fc4dbad0cda1'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'policy_value'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ee25cccbeba1b2d04870fc4dbad0cdca'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ee84c08beba1b2d04870fc4dbad0cd50'
                        key: {
                            sys_security_acl: '2684c08beba1b2d04870fc4dbad0cd46'
                            sys_user_role: {
                                id: '2621c44feb61b2d04870fc4dbad0cdf4'
                                key: {
                                    name: 'x_hete_clvmaximi_0.agent'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'ef25cccbeba1b2d04870fc4dbad0cd9f'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'policy_type'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'ef25cccbeba1b2d04870fc4dbad0cda0'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'claims_count'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'ef25cccbeba1b2d04870fc4dbad0cda1'
                        key: {
                            list_id: {
                                id: 'a725cccbeba1b2d04870fc4dbad0cd9e'
                                key: {
                                    name: 'x_hete_clvmaximi_0_sold_policy'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'payment_frequency'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'efd8d01745764ec1b08935e9c10bc781'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'risk_level'
                            value: 'low'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f15a28f7557247ceac7aabb2102e00f1'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'premium_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f3ec52f1d45f4935bd363ba928fb8413'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'policyholder_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f52dfc12c93246f9a77c19209586f15c'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'credit_utilization_percent'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f89911dc3bb54430bf44d8499309051d'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'effective_date'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fc85b64838d94e9b99d2f9b6c54f2cb0'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'bankruptcies_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fdd8de485751449383d035ad189630bb'
                        key: {
                            name: 'x_hete_clvmaximi_0_policy_holder'
                            element: 'tier'
                            value: 'premium'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'fea3c0c7eba1b2d04870fc4dbad0cd68'
                        deleted: true
                        key: {
                            name: 'x_hete_clvmaximi_0_1764945170727'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ff809b09cfbe4da09c84c5db8c5df9e1'
                        key: {
                            name: 'x_hete_clvmaximi_0_sold_policy'
                            element: 'policynumber'
                        }
                    },
                ]
            }
        }
    }
}
