import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

const messages = {
  en: {
    navbar: {
      welcome: 'welcome',
      office: 'Office',
      warnings: 'Warnings',
      notifications: 'Notifications',
      videocall: 'Videocall',
      change_pass: 'Change password',
      change_photo: 'Change photo',
      logout: 'Logout',
      settings: 'Settings',
      register_vitabox: 'Register Vitabox',
      patient_requests: 'Patient Requests',
      patient_search: 'Search patient',
      backoffice: {
        users: 'Users',
        board_models: 'Equipment Models',
        sensor_models: 'Sensor Models',
        profile_models: 'Profile Models',
        utils: 'Equipment Registration'
      }
    },
    user: {
      auth: {
        login: 'Login',
        email: 'Email',
        pass: 'Password',
        forgot_label: 'Forgot Password',
        first_name: 'First Name',
        last_name: 'Last Name',
        repeat_pass: 'Repeat Password',
        register: 'Register',
        accept: 'I accept',
        close: 'close',
        reset: 'Reset Password',
        forgot: 'Forgot Password',
        send: 'send',
        forgot_title: 'Please insert your email.',
        forgot_text: "You'll receive a code that will be valid for 1 hour to reset your password.",
        code: 'code',
        confirm_pass: "Confirm password",
        new_pass: "New password",
        old_pass: "Old password",
        submit: 'Submit',
        alter_pass: 'Alter password'
      },
      utils: {
        selected_file: 'selected file',
        browse_file: 'browse file',
        upload: 'upload',
        update_own_photo: 'Update your Photo',
        update_patient_photo: "Update {patient}'s Photo"
      },
      notification: {
        send_tooltip: "send notification",
        send_title: "Send message to {entity}",
        send_button: 'send',
        message: 'Message',
        notification: "Notifications",
        to: 'To',
        sent: 'Sent date',
        seen: 'Seen date at vitabox',
        warnings: 'Warnings',
        new_warnings: 'new warnings',
        environment: 'Environment',
        patients: 'Patients',
        graph: 'see graph'
      }
    },
    dashboard: {
      vitabox_details: "Vitabox Details",
      average: 'average',
      sensor_details: 'Sensor Details',
      patient_details: 'Patient Details',
      last_update: 'Last update',
      start_date: 'Pick Start Date',
      end_date: 'Pick End Date',
      minimum_acceptable: 'minimum acceptable',
      maximum_acceptable: 'maximum acceptable',
      print_preview: 'Print preview',
      print: 'print',
      date: 'Date',
      value: 'Value',
      last_values:'values from the last {days} days',
      no_sensors:'No environmental sensors registered',
      no_patients:'No patients registered',
      no_boards:'No equipment associated with the patient'
    },
    frontoffice: {
      vitabox: {
        pass: 'Password',
        address: 'Address',
        district: 'District',
        locality: 'Locality',
        register: 'Register',
        view_map: 'view map',
        location: 'Vitabox location',
        registered: 'Registered',
        active: 'Active',
        patients: 'Patients',
        equipment: 'Equipment',
        users: 'Users'
      },
      user: {
        new_user: 'new user',
        role: 'role',
        informal_caregiver: 'Informal caregiver',
        formal_caregiver: 'Formal caregiver',
        additional_sponsor: 'Additional sponsor',
        save: 'save',
        sponsor: 'Sponsor',
        name: 'Name',
        since: 'Since',
        actions: 'Actions',
        remove_tooltip: "remove user",
        remove_title: 'Remove access to user from vitabox',
        remove_text: 'Removing the user will cause the impossibility of access by the user.',
        remove_submit: 'proceed',
      },
      patient: {
        active: 'active',
        waiting: 'waiting for the doctor or sponsor to start activity',
        paused: 'inactive',
        details: 'patient details',
        name: 'Name',
        gender: 'Gender',
        age: 'Age',
        weight: 'Weight',
        height: 'Height',
        since: 'Since',
        state: 'State',
        actions: 'Actions',
        new_patient: 'new patient',
        birthdate: 'Birthdate',
        nif: 'NIF',
        cc: 'CC',
        add_info: 'The patient can only use the system through the vitabox after being assigned to a doctor, who should initiates his activity. Alternatively the sponsor may also start activity.',
        save: 'save',
        male: 'male',
        female: 'female',
        undefined: 'undefined',
        switch_activity: 'Switch patient activity',
        switch_info: "To activate the ptient define a doctor to monitor the patient's health and which should assign weight and height or set the parameters yourself:",
        switch_confirm: 'Are you sure you want to switch the patient activity from this vitabox?',
        submit: 'Submit',
        remove_tooltip: 'remove patient',
        remove_title: 'Remove patient from vitabox',
        remove_text: 'Removing the patient will cause the loss of record history.',
        remove_confirm: 'Are you sure?',
        patient: 'Patient',
        edit_photo: 'edit photo',
        profiles: 'Profiles',
        doctors: 'Doctors',
        boards: 'Devices',
        measure: 'Measure',
        min: 'Min',
        max: 'Max',
        board: 'Board',
        schedule: 'Schedule',
        remove: 'Remove',
        remove_board: 'Removing the board will cause the loss of record history.',
        set_device: 'set device',
        select_device: 'Select device',
        add_doctor: 'add doctor',
        doctor_email: 'Doctor email',
        exams: 'Exams',
        edit_frequency: 'Edit frequency',
        hours: 'hours',
        frequency: 'Frequency',
        edit_schedule: 'edit schedule',
        schedule_exame: 'schedule exame',
        undefined: 'undefined',
        edit_bydoctor_title: 'Edit Patient Data',
        edit_bydoctor_tooltip: 'define weight and height',
        define_profile: 'Define Profile',
        select_profile: 'Select Profile',
        edit_profile: 'Edit profile',
        minimum_acceptable: 'Minimum acceptable',
        maximum_acceptable: 'Maximum acceptable',
        defined_profile: 'Defined profile',
        alter_profile: 'Alter Profile',
        edit_profile: 'edit profile',
        update_info_tooltip: 'update personal information',
        update_info_title: 'Update patient data'
      },
      board: {
        indentification: 'Indentification',
        mac: 'MAC Address',
        last_update: 'Last Update',
        state: 'State',
        actions: 'Actions',
        active: 'active',
        inactive: 'inactive',
        new_device: 'new device',
        type: 'Board type',
        env_label: "set room (eg. 'kitchen')",
        select_patient: 'select patient',
        password: 'Password',
        biometric: 'Biometric wearable',
        medical: 'Medical device',
        environmental: 'Environmental device',
        save: 'save',
        switch_activity: 'Switch board activity',
        switch_confirm: 'Are you sure you want to switch the board activity from this vitabox?',
        submit: 'Submit',
        remove_tooltip: 'remove equipment',
        remove_title: 'Remove board from vitabox',
        remove_text: 'Removing the board will cause the loss of record history.',
        remove_confirm: 'Are you sure?',
        edit_tooltip: 'edit description',
        edit_title: 'Edit device identification',
        new_description: 'new description'
      }
    },
    doctor: {
      no_request: 'No pendent requests',
      requests: 'Requests'
    }
  },
  pt: {
    navbar: {
      welcome: 'Bem-vindo',
      office: 'Escritório',
      warnings: 'Avisos',
      notifications: 'Notificações',
      videocall: 'Video chamada',
      change_pass: 'Alterar palavra-chave',
      change_photo: 'Alterar fotografia',
      logout: 'Sair',
      settings: 'Definições',
      register_vitabox: 'Registar Vitabox',
      patient_requests: 'Pedidos de Pacientes',
      patient_search: 'Procurar paciente',
      backoffice: {
        users: 'Utilizadores',
        board_models: 'Modelos do equipamento',
        sensor_models: 'Modelos de transdutores',
        profile_models: 'Padrões de perfis clínicos',
        utils: 'Registo de equipamento'
      }
    },
    user: {
      auth: {
        login: 'Entrar',
        email: 'Email',
        pass: 'Palavra-chave',
        forgot_label: 'Esqueci-me da palavra-chave',
        first_name: 'Nome',
        last_name: 'Apelido',
        repeat_pass: 'Repetir Palavra-chave',
        register: 'Registar',
        accept: 'Aceito',
        close: 'Fechar',
        reset: 'Redefinir',
        forgot: 'Enviar email',
        send: 'enviar',
        forgot_title: 'Insira o email de registo.',
        forgot_text: 'Receberá um código, válido por 1 hora, para redefinir a sua palavra-chave',
        code: 'Código',
        confirm_pass: "Confirme palavra-chave",
        new_pass: "Nova palavra-chave",
        old_pass: "Antiga palavra-chave",
        submit: 'Submeter',
        alter_pass: 'Alterar palavra-chave'
      },
      utils: {
        selected_file: 'ficheiro selecionado',
        browse_file: 'browse file',
        upload: 'upload',
        update_own_photo: 'Actualize a sua fotografia',
        update_patient_photo: "Actualize a foto de {patient}",
      },
      notification: {
        send_tooltip: "enviar notificação",
        send_title: "Enviar mensagem para {entity}",
        send_button: 'enviar',
        message: 'Mensagem',
        notification: "Notificações",
        to: 'Para',
        sent: 'Data de envio',
        seen: 'Data de visualização pela vitabox',
        warnings: 'Avisos',
        new_warnings: 'novos avisos',
        environment: 'Ambiente',
        patients: 'Pacientes',
        graph: 'ver gráfico'
      }
    },
    dashboard: {
      vitabox_details: "Detalhes da Vitabox ",
      average: 'média',
      sensor_details: 'Detalhes do Sensor',
      patient_details: 'Detalhes do Paciente',
      last_update: 'Data de último valor',
      start_date: 'Data de início',
      end_date: 'Data de fim',
      minimum_acceptable: 'valor mínimo aceitável',
      maximum_acceptable: 'valor máximo aceitável',
      print_preview: 'Previsão de impressão',
      print: 'imprimir',
      date: 'Data',
      value: 'Valor',
      last_values:'Valores dos últimos {days} dias',
      no_sensors:'Nenhum sensor ambiental registado',
      no_patients:'Nenhum paciente registado',
      no_boards:'Nenhum equipamento associado ao paciente'
    },
    frontoffice: {
      vitabox: {
        pass: 'Palavra-chave',
        address: 'Morada',
        district: 'Distrito',
        locality: 'Localidade',
        register: 'Registar',
        view_map: 'ver no mapa',
        location: 'Localização da vitabox',
        registered: 'Registada',
        active: 'Activa',
        patients: 'Pacientes',
        equipment: 'Equipamento',
        users: 'Utilizadores',
      },
      user: {
        new_user: 'novo utilizador',
        role: 'função',
        informal_caregiver: 'Cuidador informal',
        formal_caregiver: 'Cuidador formal',
        additional_sponsor: 'Responsável Adicional',
        save: 'guardar',
        sponsor: 'Responsável',
        name: 'Nome',
        since: 'Desde',
        actions: 'Ações',
        remove_tooltip: 'remover utilizador',
        remove_title: 'Retirar acesso do utilizador à vitabox',
        remove_text: 'Ao retirar o acesso do utilizador à vitabox, este não poderá mais consultar os dados ambientais e dos pacientes da mesma.',
        submit: 'submeter',
      },
      patient: {
        active: 'activo',
        waiting: 'A aguardar que um doutor ou responsável inicie actividade',
        paused: 'desativado',
        details: 'detalhes do paciente',
        name: 'Nome',
        gender: 'Género',
        age: 'Idade',
        weight: 'Peso',
        height: 'Altura',
        since: 'Desde',
        state: 'Estado',
        actions: 'Ações',
        new_patient: 'novo paciente',
        birthdate: 'Data de nascimento',
        nif: 'NIF',
        cc: 'CC',
        add_info: 'O paciente só poderá utilizar o sistema através da vitabox depois de lhe ser associado um doutor, que deverá iniciar a sua actividade. Em alternativa o responsável poderá também iniciar actividade.',
        save: 'guardar',
        male: 'masculino',
        female: 'feminino',
        undefined: 'indefinido',
        switch_activity: 'Alterar estado de actividade do paciente',
        switch_info: "Para activar o paciente deverá atribuir um doutor, para monitoriar o estado de saúde do paciente, que deverá atribuir os valores de peso a altura, ou poderá atribuir esses valores por si próprio:",
        switch_confirm: 'Tem a certeza que pretende alterar o estado de actividade do paciente?',
        submit: 'Submeter',
        remove_tooltip: 'remover paciente',
        remove_title: 'Remover paciente da vitabox',
        remove_text: 'Ao remover o paciente serão apagados os dados de histórico do mesmo.',
        remove_confirm: 'Tem a certeza?',
        patient: 'Paciente',
        edit_photo: 'alterar fotografia',
        profiles: 'Perfis clínicos',
        doctors: 'Doutores',
        boards: 'Equipamento',
        measure: 'Medida',
        min: 'Min',
        max: 'Max',
        board: 'Dispositivo',
        schedule: 'Agendamento',
        remove: 'Remover',
        remove_board: 'Removing the board will cause the loss of record history.',
        set_device: 'associar equipamento',
        select_device: 'Selecionar equipamento',
        add_doctor: 'associar doutor',
        doctor_email: 'Email',
        exams: 'Exames',
        edit_frequency: 'Definir frequência de utilização',
        hours: 'horas',
        frequency: 'Frequência',
        edit_schedule: 'alterar agendamento',
        schedule_exame: 'agendar exame',
        undefined: 'não definido',
        edit_bydoctor_title: 'Editar dados do paciente',
        edit_bydoctor_tooltip: 'definir peso e altura',
        define_profile: 'Definir perfil clínico',
        select_profile: 'Selecionar perfil padrão',
        edit_profile: 'Editar perfil',
        minimum_acceptable: 'valor mínimo aceitável',
        maximum_acceptable: 'valor máximo aceitável',
        defined_profile: 'Perfil clínico atribuído',
        alter_profile: 'Alterar Perfil',
        update_info_tooltip: 'atualizar informação pessoal',
        update_info_title: 'Actualizar dados pessoais'
      },
      board: {
        indentification: 'Identificação',
        mac: 'Endereço MAC',
        last_update: 'Última actualização',
        state: 'Estado',
        actions: 'Ações',
        active: 'activo',
        inactive: 'desativado',
        new_device: 'novo equipamento',
        type: 'tipo de equipamento',
        env_label: "coloque divisão (ex.: 'Cozinha')",
        select_patient: 'selecione o paciente',
        password: 'Palavra-chave',
        biometric: 'Equipamento wearable',
        medical: 'Equipamento médico',
        environmental: 'Sensor ambiental',
        save: 'guardar',
        switch_activity: 'Alterar estado de actividade do equipamento',
        switch_confirm: 'Tem a certeza que pretende alterar o estado de actividade do equipamento?',
        submit: 'Submeter',
        remove_tooltip: 'remover equipamento',
        remove_title: 'Remover equipamento da vitabox',
        remove_text: 'Ao remover o equipamento da vitabox serão apagados os dados recolhidos pelo mesmo.',
        remove_confirm: 'Tem a certeza?',
        edit_tooltip: 'editar descrição',
        edit_title: 'Alterar identificação do equipamento',
        new_description: 'nova descrição'
      }
    },
    doctor: {
      no_request: 'Nenhum pedido pendente',
      requests: 'Pedidos de associação'
    }
  }
}

export default new VueI18n({
  locale: 'pt', // set locale
  messages, // set locale messages
})