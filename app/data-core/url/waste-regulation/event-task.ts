import { GarbageBaseUrl } from '../IUrl'

class EventTaskProcessorsSchemeUrl {
  constructor(private processors: EventTaskProcessorsUrl) {}
  /** EventTasks/Processors/Scheme */
  base() {
    return `${this.processors.base()}/Scheme`
  }
  /** EventTasks/Processors/Scheme/List */
  list() {
    return `${this.base()}/List`
  }
  /** EventTasks/Processors/Scheme/Daily */
  daily() {
    return `${this.base()}/Daily`
  }
}
class EventTaskProcessorsUrl {
  /** EventTasks/Processors */
  base() {
    return `${EventTaskUrl.base()}/Processors`
  }
  /** EventTasks/Processors/<ID> */
  item(id: string) {
    return `${this.base()}/${id}`
  }
  /** EventTasks/Processors/List */
  list() {
    return `${this.base()}/List`
  }
  /** EventTasks/Processors/Scheme */
  scheme = new EventTaskProcessorsSchemeUrl(this)
}

class EventTaskAvailableUrl {
  /** EventTasks/Available */
  base() {
    return `${EventTaskUrl.base()}/Available`
  }
  /** EventTasks/Available/List */
  list() {
    return `${this.base()}/List`
  }
}

class EventTaskDestinationsSchemeUrl {
  constructor(private destinations: EventTaskDestinationsUrl) {}
  /** EventTasks/Destinations/Scheme */
  base() {
    return `${this.destinations.base()}/Scheme`
  }
  /** EventTasks/Destinations/Scheme/List */
  list() {
    return `${this.base()}/List`
  }
}

class EventTaskDestinationsUrl {
  /** EventTasks/Destinations */
  base() {
    return `${EventTaskUrl.base()}/Destinations`
  }
  /** EventTasks/Destinations/<ID> */
  item(id: string) {
    return `${this.base()}/${id}`
  }
  /** EventTasks/Destinations/List */
  list() {
    return `${this.base()}/List`
  }
  /** EventTasks/Destinations/Scheme */
  scheme = new EventTaskDestinationsSchemeUrl(this)
}

class EventTaskDailyUrl {
  /** EventTasks/Daily */
  base() {
    return `${EventTaskUrl.base()}/Daily`
  }
  /** EventTasks/Daily/List */
  list() {
    return `${this.base()}/List`
  }
}

export class EventTaskUrl {
  /** EventTasks */
  static base() {
    return GarbageBaseUrl.gateway + 'EventTasks'
  }
  /** EventTasks/<ID> */
  static item(id: string) {
    return `${this.base()}/${id}`
  }
  /** EventTasks/<ID>/Take */
  static take(id: string) {
    return `${this.item(id)}/Take`
  }
  /** EventTasks/<ID>/Complete */
  static complete(id: string, description?: string) {
    let query = undefined
    if (description) {
      query = `?description=${description}`
    }
    return `${this.item(id)}/Complete${query}`
  }
  /** EventTasks/<ID>/Score */
  static score(id: string) {
    return `${this.item(id)}/Score`
  }
  /** EventTasks/List */
  static list() {
    return `${this.base()}/List`
  }
  /** EventTasks/Scheme */
  static scheme() {
    return `${this.base()}/Scheme`
  }
  /** EventTasks/Available */
  static available = new EventTaskAvailableUrl()
  /** EventTasks/Processors */
  static processors = new EventTaskProcessorsUrl()
  /** EventTasks/Destinations */
  static destinations = new EventTaskDestinationsUrl()
  /** EventTasks/Daily */
  static daily = new EventTaskDailyUrl()
}
