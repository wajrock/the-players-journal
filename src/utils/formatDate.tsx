const formatDate = (dateString:string,hour?:boolean) => {
    const date = new Date(dateString.replace(' ', 'T'));
    // Définir le formateur pour afficher le jour, le mois en texte et l'année
    
    if (hour){
      const formatter = new Intl.DateTimeFormat('fr-FR', {
        hour: 'numeric',
        minute: 'numeric'
      });
      return formatter.format(date);
    } else {
      const formatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });

      return formatter.format(date);
    }
    
    
  };

  export default formatDate;