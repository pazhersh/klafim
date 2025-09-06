import styles from './NotFound.module.css';

type NotFoundProps = {
    resourceType: string;
    resources?: string[];
}

export default function NotFound({resources, resourceType}: NotFoundProps) {
    return <div className={styles.content}>
            <h1>404 {resourceType} not found</h1>
            <p>the {resourceType} you are looking for was not found ¯\_(ツ)_/¯</p>
            {resources 
                ? <p>(looking for {resources.join(', ')})</p> 
                : null
            }
    </div>
}