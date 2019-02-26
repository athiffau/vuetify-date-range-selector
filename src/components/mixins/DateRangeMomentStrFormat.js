export default {
    methods: {
            /**
             * [dateToStr description]
             * @param  {[type]} date   [description]
             * @param  {[type]} format [description]
             * @return {[type]}        [description]
             */
            dateToStr (date, format) {
                if (format && moment) {
                    if (date !== undefined && typeof date.toISOString === 'function') {
                        return moment(this.dateToISOStr(date)).format(format)
                    } else if (date !== undefined && typeof date === 'string') {
                        return moment(date).format(format)
                    }
                } else {
                    if (date && typeof date.toISOString === 'function') {
                        return this.formatters.titleDate(date.toISOString().substr(0,10))
                    } else if (date && typeof date === 'string') {
                        return this.formatters.titleDate(date)
                    } 
                }
                return null
            },
    }
}