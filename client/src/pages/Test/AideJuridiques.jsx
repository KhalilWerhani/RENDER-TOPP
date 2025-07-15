import { motion } from 'framer-motion';
import { Lightbulb, FileText, UserCheck, HelpCircle } from 'lucide-react';
import { assets } from '../../assets/assets';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AidesJuridiques = () => {
  return (
    <div>
        <Navbar/>
    <section className="bg-white py-10 px-4 md:px-16" id="aides-juridique">
      <motion.div
        className="max-w-6xl mt-35 mx-auto flex flex-col md:flex-row items-center gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}

        
      >

        
        {/* Content Text */}
        <div className="md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0C0F0A] mb-4">
            Accompagnement juridique personnalisé
          </h2>
          <p className="text-gray-700 mb-4 text-justify">
            Chez <strong>Top-Juridique</strong>, nous comprenons que les démarches administratives et juridiques peuvent sembler complexes,
            surtout lors de la création ou la gestion d’une entreprise. C’est pourquoi nous proposons un accompagnement complet et adapté
            à votre situation, afin de vous simplifier la vie tout en respectant les obligations légales.
          </p>

          <p className="text-gray-700 mb-4 text-justify">
            Nos experts vous guident pas à pas, de la rédaction des statuts à l'immatriculation, en passant par le choix du régime juridique.
            Vous avez une question sur la domiciliation, les démarches sur le guichet unique, ou encore la protection de vos données ?
            Nous avons les réponses claires et pratiques.
          </p>
          

          <p className="text-gray-700 mb-6 text-justify">
            Ce service est inclus dans notre plateforme : vous accédez à une aide juridique fiable, rapide, et sans prise de tête.
            Plus besoin de chercher des informations partout : tout est centralisé et pensé pour les entrepreneurs modernes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <FileText />, text: 'Modèles juridiques prêts à l’emploi' },
              { icon: <UserCheck />, text: 'Assistance à la déclaration sur le guichet unique' },
              { icon: <Lightbulb />, text: 'Conseils adaptés à votre activité' },
              { icon: <HelpCircle />, text: 'Support humain et réactif' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 text-[#317ac1] font-medium"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="mt-1">{item.icon}</div>
                <span className="text-[#0C0F0A]">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image */}
        <motion.img
          src={assets.Guide_Picture4}
          alt="illustration aide juridique"
          className="w-full md:w-[280px] rounded-xl shadow-md object-contain"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </section>
    <Footer/>
    </div>
  );
};

export default AidesJuridiques;
