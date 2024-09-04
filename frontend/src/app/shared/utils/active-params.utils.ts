import {Params} from "@angular/router";
import {ArticleParamsType} from "../../../types/article-params.type";

export class ActiveParamsUtil {
  static processParams(params: Params): ArticleParamsType {
    const activeParams: ArticleParamsType = {categories: []};

    if (params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }

    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }

    return activeParams;
  }
}
